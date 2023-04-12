import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
import { deleteSource } from "../utils/cloudinary.js";

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    const { oldPassword, newPassword, imgId } = req.body;
    Boolean(imgId) === false || deleteSource(imgId, "image");

    const curUser = await User.findById(req.params.id);

    if (
      curUser.fromGoogle &&
      oldPassword &&
      !bcrypt.compare(oldPassword, curUser.password)
    ) {
      return next(createError(400, "Invalid old password"));
    }

    try {
      const update = {};
      if (newPassword) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
        update.password = hash;
      }
      Object.assign(update, req.body);

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: update },
        { new: true, select: "-password" }
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

export const deleteUser = async (req, res, next) => {
  const { oldPassword, imgId, fromGoogle } = req.body;

  if (req.params.id === req.user.id) {
    const { oldPassword, imgId } = req.body;
    imgId === null || deleteSource(imgId, "image");

    const curUser = await User.findById(req.params.id);

    if (
      !fromGoogle &&
      oldPassword &&
      !bcrypt.compare(oldPassword, curUser.password)
    ) {
      return next(createError(400, "Invalid old password"));
    }
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "You can delete only your account!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("Subscription successfull.");
  } catch (error) {
    next(error);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { subscribedUsers: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: -1 },
      });
      res.status(200).json("Unsubscription successfull.");
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: id },
      $pull: { dislikes: id },
    });
    res.status(200).json("The video has been liked.");
  } catch (error) {
    next(error);
  }
};

export const dislike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id },
    });
    res.status(200).json("The video has been disliked.");
  } catch (error) {
    next(error);
  }
};
