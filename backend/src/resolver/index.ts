import userResolvers from './user.mutation';
import projectResolvers from './project.mutation';


const resolvers = {
	Mutation: {
		...userResolvers.Mutation,
		...projectResolvers.Mutation
	}
}

export default resolvers;
