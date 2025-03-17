import type { Request, Response } from 'express';
import User from '../models/User';
import Project from '../models/Project';

export class TeamMemeberController{
    static findMemeberByEmail = async (req: Request, res: Response) => {
        const {email} = req.body;

        const user = await User.findOne({email}).select('id email name');
        if(!user){
            const error = new Error('Usuario no encontrado');
            res.status(404).json({error: error.message});
            return;
        }

        res.json(user);
    }

    static getProjecTeam = async (req: Request, res: Response) => {
        const project = await Project.findById(req.project.id).populate({
            path: 'team',
            select: '_id email name'
        })
        res.json(project.team)
    }

    static addMemeberById = async (req: Request, res: Response) => {
        const {id} = req.body;

        const user = await User.findOne({_id: id}).select('_id');
        if(!user){
            const error = new Error('Usuario no encontrado');
            res.status(404).json({error: error.message});
            return;
        }

        if(req.project.team.some(teamMember => teamMember.toString() === user.id)){
            const error = new Error('El usuario ya es parte del equipo');
            res.status(409).json({error: error.message});
            return;
        }

        req.project.team.push(user.id);
        await req.project.save();

        res.send('Usuario añadido al equipo');
    }

    static removeMemeberById = async (req: Request, res: Response) => {
        const {userId} = req.params;

        if(!req.project.team.some(teamMember => teamMember.toString() === userId)){
            const error = new Error('El usuario no es parte del equipo');
            res.status(409).json({error: error.message});
            return;
        }

        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId);
        await req.project.save();

        res.send('Usuario eliminado correctamente')
        
    }
}