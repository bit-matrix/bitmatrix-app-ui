export const timeDifference = (time: number): string => {
  const now = new Date().valueOf();

  let difference = now - time;

  const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
  difference -= daysDifference * 1000 * 60 * 60 * 24;

  const hoursDifference = Math.floor(difference / 1000 / 60 / 60);
  difference -= hoursDifference * 1000 * 60 * 60;

  const minutesDifference = Math.floor(difference / 1000 / 60);
  difference -= minutesDifference * 1000 * 60;

  const secondsDifference = Math.floor(difference / 1000);

  if (daysDifference > 0) {
    return daysDifference + ' d ';
  } else if (hoursDifference > 0) {
    return hoursDifference + ' h ';
  } else if (minutesDifference > 0) {
    return minutesDifference + ' m ';
  } else if (secondsDifference > 0) {
    return secondsDifference + ' s';
  }

  return '';
};
