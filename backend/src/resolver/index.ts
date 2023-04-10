import userResolvers from './user.mutation';
import projectResolvers from './project.mutation';
import activityResolvers from './activity.query';
import taskResolvers from './tasks.mutation';


const resolvers = {
	Activity: {
		__resolveType: (obj: any) => {
			console.log('Input:', obj);
			if (obj.state) {
				console.log('CommitActivity');
				return "CommitActivity";
			}
			if (obj.projectname) {
				console.log('InvitationActivity');
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
