import React, { useState } from 'react';
import Plot from 'react-plotly.js';

// Define types for the data structure
interface LineData {
  category: string;
  x: string[];
  y: number[];
  name: string;
  type: 'scatter';
  mode: 'lines+markers';
  marker: { color: string };
}

const AllOptionsChart: React.FC = () => {
  // Example data with two lines per category
  const data: LineData[] = [
    // Category A Lines
    {
      category: 'A',
      x: ['2023-01-01', '2023-01-02', '2023-01-03'],
      y: [10, 15, 20],
      name: 'Line A1',
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'blue' }
    },
    {
      category: 'A',
      x: ['2023-01-01', '2023-01-02', '2023-01-03'],
      y: [5, 10, 15],
      name: 'Line A2',
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'lightblue' }
    },
    // Category B Lines
    {
      category: 'B',
      x: ['2023-01-01', '2023-01-02', '2023-01-03'],
      y: [20, 25, 30],
      name: 'Line B1',
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'red' }
    },
    {
      category: 'B',
      x: ['2023-01-01', '2023-01-02', '2023-01-03'],
      y: [15, 20, 25],
      name: 'Line B2',
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'pink' }
    },
    // Category C Lines
    {
      category: 'C',
      x: ['2023-01-01', '2023-01-02', '2023-01-03'],
      y: [30, 35, 40],
      name: 'Line C1',
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'green' }
    },
    {
      category: 'C',
      x: ['2023-01-01', '2023-01-02', '2023-01-03'],
      y: [25, 30, 35],
      name: 'Line C2',
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'lightgreen' }
    }
  ];

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

  // Filter data based on visibleLines state
  const filteredData = data.filter(line => visibleLines[line.category]);

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
        data={filteredData}
        layout={{
          paper_bgcolor: 'black',
          plot_bgcolor: 'black',
          font: { color: 'gray' },
          xaxis: {
            title: 'Price',
            showgrid: false,
            range: ['2023-01-01', '2023-01-02']
          },
          yaxis: { title: 'Date OHLC', showgrid: false, range: [10, 25] }
        }}
        style={{ width: '100%', height: '100%' }} // Expand to full width and height
        useResizeHandler
      />
    </div>
  );
};

export default AllOptionsChart;
