import { ReactElement } from "react";
import { useMutation } from "@apollo/client";
import moment from "moment";
import { RiUserReceivedLine } from 'react-icons/ri';
import { TbGitCommit } from 'react-icons/tb';
import { AiOutlineCheck } from 'react-icons/ai';
import { AiOutlineClose } from 'react-icons/ai';

import { Activity, ActivityType, CommitActivity, InvitationActivity } from "../types/Dashboard";
import { ANSWER_INVITATION } from "../graphql/Dashboard/answerInvitation";
import { notify } from "../utils/notify";
import styles from '../style/dashboard.module.css';


interface ActivityTileProps {
	activity: Activity
}

function ActivityTile ({ activity }: ActivityTileProps): ReactElement {
	const [answerInvitation, { data, loading, error }] = useMutation(ANSWER_INVITATION);

	const handleInvitationAnswer = (invitationId: string, accept: boolean) => {
		answerInvitation({
			variables: {
				invitationId: invitationId,
				accept: accept
			}
		})
		.then(res => {
			const { data } = res;
			const status = data.answerInvitation.status;
			const project = data.answerInvitation.data;
			
			if (project !== null) {
				notify(status, 'success');
			} else {
				notify(status, 'error');
			}
		})
		.catch(err => {
			notify(err.message, 'error');
		});
	}

	const renderIcon = (type: string) => {
		const props = {size: '2em', color: '#f1e05a', id: styles.activityIcon}
		const icons = {
			[ActivityType.COMMIT]: <TbGitCommit {...props} />,
			[ActivityType.INVITATION]: <RiUserReceivedLine {...props} />
		};

		return icons[type as ActivityType];
	}

	const renderInvitationActivity = (activity: InvitationActivity) => {
		return (
			<div id={ styles.invitationActivity }>
				<div id={ styles.invitationActivityContent }>
					<span id={ styles.invitationContent }>
						<span className='link'>@{activity.username}</span> invited you to <span className='link'>{activity.projectname}</span>
					</span>
					<i id={ styles.activityDate }>
						{moment(activity.createdAt).format('llll')}
					</i>
				</div>
				<div id={ styles.invitationAnswerButtons }>
					<button onClick={() => handleInvitationAnswer(activity.id, true)}>
						<AiOutlineCheck color="white"/>
					</button>
					<button onClick={() => handleInvitationAnswer(activity.id, false)}>
						<AiOutlineClose color="white"/>
					</button>
				</div>
			</div>
		)
	}

	const renderCommitActivity = (activity: CommitActivity) => {
		return (
			<div id={ styles.commitActivity }>
				<span id={ styles.commitContent }>
					<span className='link'>@{ activity.createdBy }</span> updated <span className='link'>"{ activity.name }"</span> to <span className={`taskState taskState_${activity.state}`}>{ activity.state }</span>
				</span>
				<i id={ styles.activityDate }>
					{activity.createdAt}
				</i>
			</div>
		)
	}

	return (
		<div id={ styles.activityItem }>
			{renderIcon(activity.__typename)}
			<div id={ styles.activityContent }>
				{activity.__typename === ActivityType.INVITATION && (
					renderInvitationActivity(activity as InvitationActivity)
				)}
				{activity.__typename === ActivityType.COMMIT && (
					renderCommitActivity(activity as CommitActivity)
				)}
			</div>
		</div>
	);
}

export default ActivityTile;
