/* eslint-disable @typescript-eslint/no-unsafe-assignment*/
import { User } from "@/models/User";
import { JwtPayload, JwtPayloadRaw } from "@/types";
import { RouterWithAsyncHandler } from "@/utils";
import { ApiResponse } from "@/utils/responseWrapper";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ExperienceLevel, Gender } from "@/types/enums";
import { asyncHandler } from "@/utils";
import {
  uploadFile,
  containerClient,
  blobServiceClient,
} from "@/config/database";
const authRouter = RouterWithAsyncHandler();
interface LoginRequest {
  emailAddress: string;
  password: string;
}
interface RegisterRequest {
  emailAddress: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  age: number;
  height_feet: number;
  height_inches: number;
  weight: number;
  gender: Gender | null;
  profilePictureUrl: string | null;
  experienceLevel: ExperienceLevel | null;
  bio: string | null;
}

// Login route
authRouter.post("/login", async (req: Request, res: Response) => {
  const { emailAddress, password }: LoginRequest = req.body;

  // Find user
  const user = await User.findOne<User>({ where: { emailAddress } });
  if (!user) throw new Error("Invalid credential, user not found");

  // Check password
  const isValidPassword = bcrypt.compareSync(password, user.passwordHash);
  if (!isValidPassword) {
    res.status(401).json(ApiResponse.error("Invalid credentials"));
    return;
  }

  const { id, username } = user;
  const { accessToken, refreshToken } = generateTokens(user);

  // You may want to store refresh token in database here
  //send json response
  res.json({
    id,
    username,
    emailAddress,
    accessToken,
    refreshToken,
  });
});
// register route
authRouter.post("/register", async (req: Request, res: Response) => {
  const {
    emailAddress,
    password,
    username,
    firstName,
    lastName,
    age,
    height_feet,
    height_inches,
    weight,
    gender,
    profilePictureUrl,
    experienceLevel,
    bio,
  }: RegisterRequest = req.body;
  //check if  email or username already exists
  const existingEmail = await User.findOne({ where: { emailAddress } });
  const existingUsername = await User.findOne({ where: { username } });
  if (existingEmail) {
    res.status(400).json(ApiResponse.error("email address is already in use"));
    return;
  }
  if (existingUsername) {
    res.status(400).json(ApiResponse.error("username is already in use"));
    return;
  }
  try {
    //create a new user model
    const newUser = await User.create({
      emailAddress,
      username,
      firstName,
      lastName,
      age,
      height_feet,
      height_inches,
      weight,
      gender,
      profilePictureUrl,
      experienceLevel,
      bio,
      passwordHash: password, // Plain password passed, hashing handled by the model's hook
    });
    //generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser);
    //send response, which can be used to login in the client
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      emailAddress: newUser.emailAddress,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(ApiResponse.error("Error registering user"));
  }
});
//upload Profile Picture route
authRouter.post(
  "/upload-profile-picture/:id",
  uploadFile.single("profilePicture"), // Middleware to handle single file upload with key "profilePicture"
  asyncHandler(async (req: Request, res: Response) => {
    // Extract the userId parameter from the request URL
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json(ApiResponse.error("No file uploaded."));
    }

    try {
      // Generate a unique blob name using userId, timestamp, and the original file name
      const blobName = `${id}-${Date.now()}-${file.originalname}`;
      // Create a BlockBlobClient to interact with the Azure Blob Storage for the specific blob
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload the file to Azure Blob Storage
      await blockBlobClient.upload(file.buffer, file.buffer.length, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      const blobUrl = blockBlobClient.url;

      // Retrieve the user from the database using the provided userId
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json(ApiResponse.error("User not found."));
      }
      // Update the user's profilePictureUrl field in the database
      user.profilePictureUrl = blobUrl;
      await user.save();

      res.status(200).json({
        message: "Profile picture uploaded successfully.",
        profilePictureUrl: blobUrl,
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res
        .status(500)
        .json(ApiResponse.error("Error uploading profile picture."));
    }
  }),
);
authRouter.post("/refresh", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) throw new Error("Refresh token is required");

  if (typeof refreshToken !== "string") {
    throw new Error("Invalid token format");
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET!,
  ) as JwtPayload;

  const user = await User.findByPk(decoded.id);
  if (!user) throw new Error("User not found");

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

  res.json({
    id: user.id,
    username: user.username,
    emailAddress: user.emailAddress,
    accessToken,
    refreshToken: newRefreshToken,
  });
});

const generateTokens = (
  user: User,
): { accessToken: string; refreshToken: string } => {
  const payload: JwtPayloadRaw = {
    id: user.id,
    emailAddress: user.emailAddress,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

  return { accessToken, refreshToken };
};

export default authRouter;
