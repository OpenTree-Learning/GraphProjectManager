import userResolvers from './user.mutation';
import projectResolvers from './project.mutation';
import activityResolvers from './activity.query';
import taskResolvers from './tasks.mutation';


const resolvers = {
	Query: {
		...activityResolvers.Query
	},
	Mutation: {
		...userResolvers.Mutation,
		...projectResolvers.Mutation,
		...taskResolvers.Mutation
	}
}

export default resolvers;
