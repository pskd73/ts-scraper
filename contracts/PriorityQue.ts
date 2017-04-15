import CoreJob from 'app/core/CoreJob';

interface PriorityQue {
    priority: number
    que: Array<CoreJob>
    index: number
}

export default PriorityQue;
