import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { fetchData } from '../utils/fetchData';
import SelectComponent from '../components/SelectComponent';

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
};

const AllOptionsChart: React.FC = () => {
  // Example data with two lines per category
  const [data, setData] = useState<any>([]);
  const [chartData, setChartData] = useState<any>(data);
  const [assetIndex, setAssetIndex] = useState<number>(0);

  const assetList = [
    'ABEV3',
    'B3SA3',
    'BBAS3',
    'BBDC4',
    'BBSE3',
    'BOVA11',
    'BRKM5',
    'ELET6',
    'EMBR3',
    'GGBR4',
    'HAPV3',
    'ITSA4',
    'ITUB4',
    'KLBN11',
    'MGLU3',
    'NTCO3',
    'PCAR3',
    'PETR4',
    'PRIO3',
    'SANB11',
    'SMAL11',
    'SUZB3',
    'TAEE11',
    'USIM5',
    'VALE3'
  ];

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
    setChartData(
      data.filter((el: ChartData) => el.undelyingAsset == assetList[assetIndex])
    );
  }, [data, assetIndex]);

  return (
    <div
      style={{
        backgroundColor: 'black',
        height: '100vh'
      }}
    >
      {/* Checkboxes for Filtering Lines */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: 'black'
        }}
      >
        {Object.keys(visibleLines).map(category => (
          <label style={{ color: 'white', marginRight: '20px' }} key={category}>
            <input
              type="checkbox"
              checked={visibleLines[category]}
              onChange={() => toggleLineVisibility(category)}
            />
            Line {category}
          </label>
        ))}
        <SelectComponent
          data={assetList}
          onChange={e => setAssetIndex(Number(e.target.value))}
        />
      </div>
      <Plot
        data={chartData}
        layout={{
          paper_bgcolor: 'black',
          plot_bgcolor: 'black',
          font: { color: 'gray' },
          xaxis: {
            title: 'Date OHLC',
            showgrid: false,
            range: ['01072024 - O', '14112024 - C']
          },
          yaxis: { title: 'Price', showgrid: false }
        }}
        style={{ width: '100%', height: '100%' }} // Expand to full width and height
        useResizeHandler
      />
    </div>
  );
};

export default AllOptionsChart;
