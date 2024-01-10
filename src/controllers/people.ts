import { RequestHandler } from "express";
import * as people from "../services/people";
import { z } from "zod";
import { decryptMatch } from "../utils/match";

export const getAll: RequestHandler = async (req, res) => {
  const { id_event, id_group } = req.params;
  const items = await people.getAll({
    id_event: parseInt(id_event),
    id_group: parseInt(id_group)
  });
  if(items) return res.json({people: items});

  res.json({ error: 'Ocorreu um erro'});
}

export const getPerson: RequestHandler = async (req, res) => {
  const { id_event, id_group, id } = req.params;
  const item = await people.getOne({
    id_event: parseInt(id_event),
    id_group: parseInt(id_group),
    id: parseInt(id)
  });
  if(item) return res.json({people: item});

  res.json({ error: 'Ocorreu um erro'});
}

export const addPerson: RequestHandler = async (req, res) => {
  const { id_event, id_group } = req.params;
  const addPeopleSchema = z.object({
    name: z.string(),
    cpf: z.string().transform(value => value.replace(/\.|-/gm, ''))
  });
  const body = addPeopleSchema.safeParse(req.body);
  if(!body.success) return res.json({ error: 'Dados inválidos'});

  const newPeople = await people.add({
    name: body.data.name,
    cpf: body.data.cpf,
    id_event: parseInt(id_event),
    id_group: parseInt(id_group)
  });
  if(newPeople) return res.status(201).json({people: newPeople});

  res.json({ error: 'Ocorreu um erro'});
}

export const updatePerson: RequestHandler = async (req, res) => {
  const { id_event, id_group, id } = req.params;
  const updatePeopleSchema = z.object({
    name: z.string().optional(),
    cpf: z.string().transform(value => value.replace(/\.|-/gm, '')).optional(),
    matched: z.string().optional()
  });
  const body = updatePeopleSchema.safeParse(req.body);
  if(!body.success) return res.json({ error: 'Dados inválidos'});

  const updatedPeople = await people.update({
    id_event: parseInt(id_event),
    id_group: parseInt(id_group),
    id: parseInt(id)
  }, body.data);
  if(updatedPeople) {
    const personItem = await people.getOne({
      id: parseInt(id),
      id_event: parseInt(id_event),
    });
    return res.status(201).json({person: personItem});
  }

  res.json({ error: 'Ocorreu um erro'});
}

export const deletePerson: RequestHandler = async (req, res) => {
  const { id_event, id_group, id } = req.params;
  const deleted = await people.remove({
    id_event: parseInt(id_event),
    id_group: parseInt(id_group),
    id: parseInt(id)
  });
  if(deleted) return res.json({ person: deleted });

  res.json({ error: 'Ocorreu um erro'});
}

export const searchPerson: RequestHandler = async (req, res) => {
  const { id_event } = req.params;

  const searchPersonSchema = z.object({
    cpf: z.string().transform(value => value.replace(/\.|-/gm, ''))
  });
  const query = searchPersonSchema.safeParse(req.query);
  if(!query.success) return res.json({ error: 'Dados inválidos' });

  const personItem = await people.getOne({
    id_event: parseInt(id_event),
    cpf: query.data.cpf
  });
  if(personItem && personItem.matched) {
    const matchId = decryptMatch(personItem.matched);

    const personMatched = await people.getOne({
      id_event: parseInt(id_event),
      id: matchId
    });

    if(personMatched) return res.json({ 
      person: {
        id: personItem.id,
        name: personItem.name,
      },
      personMatched: {
        id: personMatched.id,
        name: personMatched.name,
      }
    });
  }

  res.json({ error: 'Ocorreu um erro'});
}