export function getTimeDifference(createdAt: string | Date): string {
  const createdDate = new Date(createdAt);
  const now = new Date();

  // Calculate difference in milliseconds
  const diffMs = now.getTime() - createdDate.getTime();

  // Convert to minutes/hours/days
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else {
    return `${diffDays} ngày trước`;
  }
}
