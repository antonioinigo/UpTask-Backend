import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from 'express-validator'
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemeberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

router.use(authenticate) // All routes in this file will require authentication

router.post ('/',  
    // authenticate,
    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'),
    handleInputErrors,
    ProjectController.createProject
)
router.get ('/', ProjectController.getAllProjects);

router.get ('/:id', 

    param('id').isMongoId().withMessage('El ID del Proyecto no es válido'),
    handleInputErrors,
    ProjectController.getProjectById
);
router.param('projectId', projectExists)

router.put ('/:projectId', 
    param('id').isMongoId().withMessage('El ID del Proyecto no es válido'),
    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
);

router.delete ('/:projectId', 
    param('id').isMongoId().withMessage('El ID del Proyecto no es válido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject
);

//Task Routes


router.post('/:projectId/tasks',
    hasAuthorization,
    body('name')
        .notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks', 

    TaskController.getProjectTasks
);

router.param('taskId',taskExists )
router.param('taskId', taskBelongsToProject )

router.get('/:projectId/tasks/:taskId', 
    param('taskId').isMongoId().withMessage('El ID de la Tarea no es válido'),
    handleInputErrors,
    TaskController.getTaskById
);

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('El ID de la Tarea no es válido'),
    body('name')
        .notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
);


router.delete('/:projectId/tasks/:taskId', 
    hasAuthorization,
    param('taskId').isMongoId().withMessage('El ID de la Tarea no es válido'),
    handleInputErrors,
    TaskController.deleteTask
);

router.post ('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('El ID de la Tarea no es válido'),
    body('status')
        .notEmpty().withMessage('El estado es obligatorio')
        .isIn(['pending', 'onHold', 'inProgress', 'underReview', 'completed']).withMessage('El estado de la tarea no es válido'),
    handleInputErrors,
    TaskController.updateStatus

)

//Router for Teams

router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('El email no es válido'),
    handleInputErrors,
    TeamMemeberController.findMemeberByEmail
)

router.get('/:projectId/team',
    TeamMemeberController.getProjecTeam
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('El ID del usuario no es válido'),
    handleInputErrors,
    TeamMemeberController.addMemeberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('El ID del usuario no es válido'),
    handleInputErrors,
    TeamMemeberController.removeMemeberById
)

//Router for Notes

router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId')
        .isMongoId().withMessage('El ID de la nota no es válido'),
    handleInputErrors,
    NoteController.deleteNote
)




export default router;