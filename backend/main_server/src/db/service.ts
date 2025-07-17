import prisma from './client';

// Create a new Item
export const createItem = async (server_id: string, data: string) => {
  const item = await prisma.item.create({
    data: {
      server_id,
      data,
    },
  });
  return item;
};

// Get all items with a given server_id
export const getItemsByServerId = async (server_id: string) => {
  const items = await prisma.item.findMany({
    where: {
      server_id,
    },
  });
  return items;
};
