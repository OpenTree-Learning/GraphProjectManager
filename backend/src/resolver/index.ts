import userResolvers from './user.mutation';
import projectResolvers from './project.mutation';
import activityResolvers from './activity.query';
import taskResolvers from './tasks.mutation';


const resolvers = {
	Activity: {
		__resolveType: (obj: any) => {
			if (obj.state) {
				return "CommitActivity";
			}
			if (obj.projectname) {
				return "InvitationActivity";
			}
			return null;
		}
	},
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
