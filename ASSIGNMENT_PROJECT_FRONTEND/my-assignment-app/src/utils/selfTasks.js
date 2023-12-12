import UserModel from '../services/userService';

export const selfTaskCompleted = async (task_id, user_id, access_token, tasks, setTasks) => {
    const match = await UserModel.finishSelfTask(access_token, {user_id, task_id});
    if(match){
        console.log('MATCH TASK COMPLETE',match);
      
    }
}

