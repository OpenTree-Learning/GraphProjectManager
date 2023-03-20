import userResolvers from './user.mutation';


const resolvers = {
	Mutation: {
		...userResolvers.Mutation
	}
}

export default resolvers;
