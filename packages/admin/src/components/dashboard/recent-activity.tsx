import React from 'react';

interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  createdAt: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div data-testid="recent-activity">
      <h3>최근 활동</h3>
      {activities.length === 0 ? (
        <div>최근 활동이 없습니다</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {activities.map((activity) => (
            <li key={activity.id} style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
              [{activity.createdAt}] [{activity.userName}] {activity.action}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
