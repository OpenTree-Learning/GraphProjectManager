import userResolvers from './user.mutation';
import projectMutationResolvers from './project.mutation';
import projectQueryResolvers from './project.query';
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
	ProjectNode: {
		__resolveType: (obj: any) => {
			if (obj.username) {
				return "UNode";
			}
			if (obj.state) {
				return "TNode";
			}
			if (obj.name && obj.description && obj.createdAt && obj.id) {
				return "PNode";
			}
			return null;
		}
	},
	Query: {
		...activityResolvers.Query,
		...projectQueryResolvers.Query
	},
	Mutation: {
		...userResolvers.Mutation,
		...projectMutationResolvers.Mutation,
		...taskResolvers.Mutation
	}
}

export default resolvers;
