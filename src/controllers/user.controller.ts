import { PrismaClient } from "@prisma/client";

const userClient = new PrismaClient().user;

//getAllUsers
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userClient.findMany({
      include: {
        locations: true,
      },
    });

    res.status(200).json({ data: allUsers });
  } catch (error) {
    console.log(error);
  }
};

//getUserById
export const getUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const user = await userClient.findUnique({
      where: {
        id: userId,
      },
      include: {
        locations: true,
      },
    });

    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
  }
};

//createUser
export const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await userClient.create({
      data: userData,
    });

    res.status(201).json({ data: user });
  } catch (error) {
    console.log(error);
  }
};

//updateUser
export const updateUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const userData = req.body;
    const user = await userClient.update({
      where: {
        id: userId,
      },
      data: userData,
    });

    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
  }
};

//deleteUser
export const deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const user = await userClient.delete({
      where: {
        id: userId,
      },
    });

    res.status(200).json({ messsage: "successfully" });
  } catch (error) {
    console.log(error);
  }
};
