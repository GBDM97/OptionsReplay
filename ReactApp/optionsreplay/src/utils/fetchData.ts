import chartJson from '../data/chart.json';
import { ChartData } from '../pages/AllOptionsChart';

export const fetchData = async () => (await chartJson) as any;
