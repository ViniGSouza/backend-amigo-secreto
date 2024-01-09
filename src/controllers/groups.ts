import { RequestHandler } from "express";
import * as groups from "../services/groups";
import { z } from "zod";

export const getAll: RequestHandler = async (req, res) => {
  const { id_event } = req.params;
  const items = await groups.getAll(parseInt(id_event));
  if(items) return res.json({groups: items});

  res.json({ error: 'Ocorreu um erro'});
}

export const getGroup: RequestHandler = async (req, res) => {
  const { id_event, id } = req.params;
  const groupItem = await groups.getOne({
    id_event: parseInt(id_event), 
    id: parseInt(id)});
  if(groupItem) return res.json({group: groupItem});

  res.json({ error: 'Ocorreu um erro'});
}

export const addGroup: RequestHandler = async (req, res) => {
  const { id_event } = req.params;
  const addGroupSchema = z.object({
    name: z.string(),
  });
  const body = addGroupSchema.safeParse(req.body);
  if (!body.success) return res.json({ error: 'Dados inválidos' });

  const newGroup = await groups.add({
    name: body.data.name,
    id_event: parseInt(id_event),
  });
  if (newGroup) return res.status(201).json({ group: newGroup });

  res.json({ error: 'Ocorreu um erro' });
}

export const updateGroup: RequestHandler = async (req, res) => {
  const { id_event, id } = req.params;
  const updateGroupSchema = z.object({
    name: z.string().optional(),
  });
  const body = updateGroupSchema.safeParse(req.body);
  if(!body.success) return res.json({ error: 'Dados inválidos'});

  const updatedGroup = await groups.update({
    id_event: parseInt(id_event),
    id: parseInt(id)
  }, body.data);
  if(updatedGroup) return res.status(201).json({ group: updatedGroup });

  res.json({ error: 'Ocorreu um erro' });
}

export const deleteGroup: RequestHandler = async (req, res) => {
  const { id_event, id } = req.params;
  const deletedGroup = await groups.remove({
    id_event: parseInt(id_event),
    id: parseInt(id)
  });
  if(deletedGroup) return res.json({ group: deletedGroup });

  res.json({ error: 'Ocorreu um erro' });
}