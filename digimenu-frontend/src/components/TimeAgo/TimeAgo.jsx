import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/vi'; // hiển thị tiếng Việt
import classNames from 'classnames/bind';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi'); // set ngôn ngữ tiếng Việt

function TimeAgo({ date }) {
    const now = dayjs();
    const time = dayjs(date).tz('Asia/Ho_Chi_Minh');

    const diffInDays = now.diff(time, 'day');

    const displayTime =
        diffInDays > 7 ? time.format('DD/MM/YYYY') : time.fromNow(); // time ago

    return <span>{displayTime}</span>;
}

export default TimeAgo;
