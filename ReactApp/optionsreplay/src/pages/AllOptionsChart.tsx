import React, { useEffect, useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import { fetchData } from '../utils/fetchData';
import SelectComponent from '../components/SelectComponent';
import { PlotMouseEvent, PlotRelayoutEvent } from 'plotly.js';

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
  strike: number;
};

type Span = {
  min: number;
  max: number;
};

type SpanRef = Span & {
  available: number[];
};

type ViewRange = {
  xrange0: undefined | string | number;
  xrange1: undefined | string | number;
  yrange0: undefined | string | number;
  yrange1: undefined | string | number;
};

const AllOptionsChart: React.FC = () => {
  let currentView: React.SetStateAction<ViewRange>;
  const viewRangeIntialState = {
    xrange0: '01072024 - O',
    xrange1: '14112024 - C',
    yrange0: '',
    yrange1: ''
  };
  const [data, setData] = useState<any>([]);
  const [chartData, setChartData] = useState<any>(data);
  const [hideLines, setHideLines] = useState<Array<string>>([]);
  const [assetIndex, setAssetIndex] = useState<number>(0);
  const [availableStrikes, setAvailableStrikes] = useState<Array<number>>([]);
  const [strikeSpan, setStrikeSpan] = useState<Span>({ min: 0, max: 1000 });
  const strikeRef = useRef<SpanRef>({ min: 0, max: 1000, available: [] });
  const [lock, setLock] = useState<boolean>(false);
  const [viewRange, setViewRange] = useState<ViewRange>(viewRangeIntialState);

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

  const filterControl = (category: string) => {
    setFilter(prevState => ({
      ...prevState,
      [category]: !prevState[category]
    }));
  };

  const handlePlotClick = (event: PlotMouseEvent) => {
    const { points } = event;

    if (points && points.length > 0) {
      const clickedPoint = points[0];
      const lineName: string = clickedPoint.data.name;
      setHideLines(p => [...p, lineName]);
    }
  };

  const handleReLayout = (event: Readonly<PlotRelayoutEvent>) => {
    currentView = {
      xrange0: event['xaxis.range[0]'],
      xrange1: event['xaxis.range[1]'],
      yrange0: event['yaxis.range[0]'],
      yrange1: event['yaxis.range[1]']
    };
  };

  const handleKeyboardEvent = (event: KeyboardEvent) => {
    if (event.key === 'w') {
      if (
        strikeRef.current.available.indexOf(strikeRef.current.min) == 0 ||
        strikeRef.current.min == 0
      )
        return;
      setStrikeSpan(p => ({
        ...p,
        max: strikeRef.current.available[
          strikeRef.current.available.indexOf(strikeRef.current.max) - 1
        ],
        min: strikeRef.current.available[
          strikeRef.current.available.indexOf(strikeRef.current.min) - 1
        ]
      }));
    } else if (event.key === 's') {
      if (
        strikeRef.current.available.indexOf(strikeRef.current.max) ==
        strikeRef.current.available.length - 1
      )
        return;
      setStrikeSpan(p => ({
        ...p,
        max: strikeRef.current.available[
          strikeRef.current.available.indexOf(strikeRef.current.max) + 1
        ],
        min: strikeRef.current.available[
          strikeRef.current.min == 0
            ? 1
            : strikeRef.current.available.indexOf(strikeRef.current.min) + 1
        ]
      }));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardEvent);
    return () => window.addEventListener('keydown', handleKeyboardEvent);
  }, []);

  useEffect(() => {
    getData();
    const filtersArray: (string | number | null)[] = Object.entries(filter)
      .map(v => (v[1] ? v[0] : null))
      .filter(el => Boolean(el));
    const firstFilteredData = data.filter(
      (el: ChartData) =>
        el.undelyingAsset == assetList[assetIndex] &&
        filtersArray.includes(el.week) &&
        filtersArray.includes(String(el.month)) &&
        filtersArray.includes(el.side) &&
        !hideLines.includes(el.name)
    );
    setAvailableStrikes(
      Array.from(
        new Set(
          firstFilteredData.map((e: ChartData) => e.strike).sort((a: number, b: number) => a - b)
        )
      )
    );
    const finalFilteredData = firstFilteredData.filter(
      (e: ChartData) => e.strike >= strikeSpan.min && e.strike <= strikeSpan.max
    );
    setChartData(finalFilteredData);
    strikeRef.current = { ...strikeSpan, available: availableStrikes };
  }, [data, assetIndex, filter, strikeSpan, hideLines]);

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
        <label style={{ color: 'white', marginRight: '20px' }}>
          <input
            type="checkbox"
            checked={lock}
            onChange={() => {
              setLock(p => !p);
              setViewRange(currentView ?? viewRange);
            }}
          />
          Lock
        </label>
        <SelectComponent
          value={assetIndex}
          data={assetList}
          onChange={e => setAssetIndex(Number(e.target.value))}
        />
        <SelectComponent
          value={availableStrikes.indexOf(strikeSpan.min)}
          data={availableStrikes}
          onChange={e =>
            setStrikeSpan(p => ({ ...p, min: Number(availableStrikes[Number(e.target.value)]) }))
          }
        />
        <SelectComponent
          value={availableStrikes.indexOf(strikeSpan.max)}
          data={availableStrikes}
          onChange={e =>
            setStrikeSpan(p => ({ ...p, max: Number(availableStrikes[Number(e.target.value)]) }))
          }
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
            range: [viewRange.xrange0, viewRange.xrange1],
            fixedrange: lock
          },
          yaxis: {
            title: 'Price',
            showgrid: false,
            range: [viewRange.yrange0, viewRange.yrange1],
            fixedrange: lock
          },
          autosize: true,
          margin: {
            l: 20,
            r: 0,
            t: 0,
            b: 20
          }
        }}
        config={{
          scrollZoom: !lock,
          displayModeBar: !lock,
          showAxisDragHandles: !lock
        }}
        style={{ width: '100%', height: '100%' }}
        onClick={handlePlotClick}
        onRelayout={handleReLayout}
      />
    </div>
  );
};

export default AllOptionsChart;
