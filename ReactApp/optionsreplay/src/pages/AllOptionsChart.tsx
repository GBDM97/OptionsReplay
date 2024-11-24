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
  const [filter, setFilter] = useState<Record<string | number, boolean>>({
    W1: false,
    W2: false,
    W3: false,
    W4: false,
    W5: false,
    CALL: false,
    PUT: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
    12: false
  });

  // Toggle line visibility
  const filterControl = (category: string) => {
    setFilter(prevState => ({
      ...prevState,
      [category]: !prevState[category]
    }));
  };

  useEffect(() => {
    getData();
    const filtersArray: (string | number | null)[] = Object.entries(filter)
      .map(v => (v[1] ? v[0] : null))
      .filter(el => Boolean(el));
    setChartData(
      data.filter(
        (el: ChartData) =>
          el.undelyingAsset == assetList[assetIndex] &&
          filtersArray.includes(el.week) &&
          filtersArray.includes(String(el.month)) &&
          filtersArray.includes(el.side)
      )
    );
  }, [data, assetIndex, filter]);

  return (
    <div
      style={{
        backgroundColor: 'black',
        height: '100vh'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: 'black'
        }}
      >
        {Object.keys(filter).map(category => (
          <label style={{ color: 'white', marginRight: '20px' }} key={category}>
            <input
              type="checkbox"
              checked={filter[category]}
              onChange={() => {
                filterControl(category);
              }}
            />
            {category}
          </label>
        ))}
        <SelectComponent data={assetList} onChange={e => setAssetIndex(Number(e.target.value))} />
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
          yaxis: { title: 'Price', showgrid: false },
          autosize: true,
          margin: {
            l: 20, // Left margin
            r: 0, // Right margin
            t: 0, // Top margin
            b: 20 // Bottom margin
          }
        }}
        style={{ width: '100%', height: '100%' }} // Expand to full width and height
      />
    </div>
  );
};

export default AllOptionsChart;
