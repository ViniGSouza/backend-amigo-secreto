import { PrismaClient, Prisma } from "@prisma/client";
import * as groups from "./groups";

const prisma = new PrismaClient();

type GetAllFilters = { id_event: number, id_group?: number; }
export const getAll = async (filters: GetAllFilters) => {
  try {
    return await prisma.eventPeople.findMany({ where: filters });
  } catch (err) {
    return false;
  }
}

type GetOneFilters = { id_event: number, id_group?: number, id: number; }
export const getOne = async (filters: GetOneFilters) => {
  try {
    return await prisma.eventPeople.findFirst({ where: filters });
  } catch (err) {
    return false;
  }
}

type PersonCreateData = Prisma.Args<typeof prisma.eventPeople, 'create'>['data'];
export const add = async (data: PersonCreateData) => {
  try {
    if(!data.id_group) return false;

    const group = await groups.getOne({
      id: data.id_group,
      id_event: data.id_event
    });
    if(!group) return false;

    return await prisma.eventPeople.create({ data });
  } catch (err) {
    return false;
  }
}

type PersonUpdateData = Prisma.Args<typeof prisma.eventPeople, 'update'>['data'];
type UpdateFilters = { id_event: number, id_group?: number, id?: number; }
export const update = async (filters: UpdateFilters, data: PersonUpdateData) => {
  try {
    return await prisma.eventPeople.updateMany({ where: filters, data });
  } catch (err) {
    return false;
  }
}

type DeleteFilters = { id_event?: number, id_group?: number, id: number; }
export const remove = async (filters: DeleteFilters) => {
  try {
    return await prisma.eventPeople.delete({ where: filters });
  } catch (err) {
    return false;
  }
}