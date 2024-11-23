import chartJson from '../data/test.json';
import { ChartData } from '../pages/AllOptionsChart';

export const fetchData = async () => (await chartJson) as ChartData;
