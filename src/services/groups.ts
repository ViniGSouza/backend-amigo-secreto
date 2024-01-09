import { PrismaClient, Prisma } from "@prisma/client";
import * as events from "./events";

const prisma = new PrismaClient();

export const getAll = async (id_event: number) => {
  try {
    return await prisma.eventGroup.findMany({ where: { id_event } });
  } catch(err) {
    return false;
  }
}

type GetOneFilters = {
  id_event?: number;
  id: number;
}
export const getOne = async (filters: GetOneFilters) => {
  try {
    return await prisma.eventGroup.findFirst({ where: filters });
  } catch(err) {
    return false;
  }
}
type GroupCreateData = Prisma.Args<typeof prisma.eventGroup, 'create'>['data']
export const add = async (data: GroupCreateData) => {
  try {
    if(!data.id_event) return false;
    
    const eventItem = await events.getOne(data.id_event);
    if(!eventItem) return false;

    return await prisma.eventGroup.create({ data });
  } catch(err) {
    return false;
  }
}

type UpdateFilters = {
  id_event?: number;
  id: number;
}
type GroupsUpdateData = Prisma.Args<typeof prisma.eventGroup, 'update'>['data']
export const update = async (filters: UpdateFilters, data: GroupsUpdateData) => {
  try {
    return await prisma.eventGroup.update({ where: filters, data });
  } catch(err) {
    return false;
  }
}

type DeleteFilters = {
  id_event?: number;
  id: number;
}
export const remove = async (filters: DeleteFilters) => {
  try {
    return await prisma.eventGroup.delete({ where: filters });
  } catch(err) {
    return false;
  }
}