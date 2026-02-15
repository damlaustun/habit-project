import WeekRangeHeader from './WeekRangeHeader';

type WeekNavigatorProps = {
  weekId: string;
  weekLabel: string;
  isCurrentWeek: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onPickWeek: (weekId: string) => void;
};

const WeekNavigator = (props: WeekNavigatorProps) => {
  return (
    <WeekRangeHeader
      weekId={props.weekId}
      weekLabel={props.weekLabel}
      isCurrentWeek={props.isCurrentWeek}
      onPrevious={props.onPrevious}
      onNext={props.onNext}
      onWeekPick={props.onPickWeek}
    />
  );
};

export default WeekNavigator;
