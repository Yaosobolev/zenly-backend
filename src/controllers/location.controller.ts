import { PrismaClient } from "@prisma/client";

const locationClient = new PrismaClient().location;

//getAllLocations
export const getAllLocations = async (req, res) => {
  try {
    const allLocations = await locationClient.findMany();

    res.status(200).json({ data: allLocations });
  } catch (error) {
    console.log(error);
  }
};

//getLocationById
export const getLocationById = async (req, res) => {
  try {
    const locationId = Number(req.params.id);
    const location = await locationClient.findUnique({
      where: {
        id: locationId,
      },
    });

    res.status(200).json({ data: location });
  } catch (error) {
    console.log(error);
  }
};

//createLocation
export const createLocation = async (req, res) => {
  try {
    const locationData = req.body;
    const location = await locationClient.create({
      data: {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        user: {
          connect: { id: locationData.userId },
        },
      },
    });

    res.status(201).json({ data: location });
  } catch (error) {
    console.log(error);
  }
};

//updateLocation
export const updateLocation = async (req, res) => {
  try {
    const locationId = Number(req.params.id);
    const locationData = req.body;
    const location = await locationClient.update({
      where: {
        id: locationId,
      },
      data: locationData,
    });

    res.status(200).json({ data: location });
  } catch (error) {
    console.log(error);
  }
};

//deleteLocation
export const deleteLocation = async (req, res) => {
  try {
    const locationId = Number(req.params.id);
    const location = await locationClient.delete({
      where: {
        id: locationId,
      },
    });

    res.status(200).json({ messsage: "successfully" });
  } catch (error) {
    console.log(error);
  }
};
