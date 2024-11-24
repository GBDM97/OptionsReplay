import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { fetchData } from '../utils/fetchData';

// Define types for the data structure

export type ChartData = {
  name: string;
  undelyingAsset: string;
  x: string[];
  y: number[];
  side: 'CALL' | 'PUT';
  month: number;
  week: string;
  type: 'scatter' | 'line' | 'bar';
  mode: 'lines+markers' | 'lines' | 'markers';
  strike: number | null;
}[];

const AllOptionsChart: React.FC = () => {
  // Example data with two lines per category
  const [data, setData] = useState<any>([]);

  const getData = async () => {
    const d = await fetchData();
    setData(d);
  };

  // State for visible lines
  const [visibleLines, setVisibleLines] = useState<Record<string, boolean>>({
    A: true,
    B: true,
    C: true
  });

  // Toggle line visibility
  const toggleLineVisibility = (category: string) => {
    setVisibleLines(prevState => ({
      ...prevState,
      [category]: !prevState[category]
    }));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ backgroundColor: 'orange', height: '100vh' }}>
      {/* Checkboxes for Filtering Lines */}
      <div>
        {Object.keys(visibleLines).map(category => (
          <label key={category}>
            <input
              type="checkbox"
              checked={visibleLines[category]}
              onChange={() => toggleLineVisibility(category)}
            />
            Line {category}
          </label>
        ))}
      </div>
      <Plot
        data={data}
        layout={{
          paper_bgcolor: 'black',
          plot_bgcolor: 'black',
          font: { color: 'gray' },
          xaxis: {
            title: 'Date OHLC',
            showgrid: false,
            range: ['2023-01-01', '2023-01-02']
          },
          yaxis: { title: 'Price', showgrid: false, range: [10, 25] }
        }}
        style={{ width: '100%', height: '100%' }} // Expand to full width and height
        useResizeHandler
      />
    </div>
  );
};

export default AllOptionsChart;
