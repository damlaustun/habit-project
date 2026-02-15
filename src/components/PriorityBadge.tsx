import PriorityIndicator from './PriorityIndicator';
import type { HabitPriority } from '../types/habit';

type PriorityBadgeProps = {
  priority: HabitPriority;
};

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  return <PriorityIndicator priority={priority} />;
};

export default PriorityBadge;
