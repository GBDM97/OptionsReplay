import { useState } from 'react';
import '../App.css';
import data from '../data/oldData.json';
import OperationsList from '../components/OperationsList';
import { getReverseOptionCode } from '../utils/getReverseOptionCode';
import PeriodSelector from '../components/PeriodSelector';
import SelectComponent from '../components/SelectComponent';

export type AssetInfo = {
  [key: string]: string[];
};

const OperationPage = () => {
  const [dateIndex, setDateIndex] = useState<number>(0);
  const [list, setList] = useState<AssetInfo>({});

  const indexToData = () => {
    if (dateIndex === 1) {
      return { entry: data.D01072024, exit: data.D05072024 };
    }
    if (dateIndex === 2) {
      return { entry: data.D24062024, exit: data.D28062024 };
    }
    if (dateIndex === 3) {
      return { entry: data.D17062024, exit: data.D21062024 };
    }
    if (dateIndex === 4) {
      return { entry: data.D10062024, exit: data.D14062024 };
    }
    if (dateIndex === 5) {
      return { entry: data.D03062024, exit: data.D07062024 };
    } else {
      return;
    }
  };

  const search = (search_string: string, isEntry: boolean) => {
    if (search_string === '') {
      setList({});
      return;
    }
    search_string = search_string.toUpperCase();
    const selectedData = indexToData();
    if (!selectedData) {
      return;
    }
    const jsonInput1: AssetInfo = selectedData.entry;
    const jsonInput2: AssetInfo = selectedData.exit;

    const jsonSearch = (
      dateJson: { [key: string]: string[] },
      searchType: string,
      asset_to_search?: string,
      reverse?: boolean
    ) => {
      if (searchType === 'seriesSearch' && asset_to_search && reverse) {
        const optioncode = asset_to_search
          .split('')
          .reverse()
          .join('')
          .match(/[a-zA-Z]/g);
        asset_to_search =
          asset_to_search.slice(0, 4) +
          getReverseOptionCode(optioncode ? optioncode[1] : '') +
          asset_to_search.slice(-2);
      }

      return Object.entries(dateJson).filter(([current_asset]) => {
        if (searchType === 'includes') {
          return current_asset.includes(search_string);
        } else if (searchType === 'exact') {
          return current_asset === asset_to_search;
        } else if (searchType === 'seriesSearch' && asset_to_search) {
          return (
            current_asset.slice(-2) === asset_to_search.slice(-2) &&
            current_asset.slice(0, 5) === asset_to_search.slice(0, 5)
          );
        }
      });
    };

    const getExitInfo = (current_asset: string) => {
      const exitInfo = jsonSearch(jsonInput2, 'exact', current_asset);
      return exitInfo && exitInfo[0] ? exitInfo[0][1][3] : '0.01';
    };

    const getReverseOperation = (entryPrice: string, asset: string) => {
      let priceDiference = 1000;
      let reverseAsset;
      const seriesSearch = jsonSearch(jsonInput1, 'seriesSearch', asset, true);
      seriesSearch.forEach(([ticker, priceArray]) => {
        const currentDifference = Math.abs(Number(priceArray[1]) - Number(entryPrice));
        if (currentDifference < priceDiference) {
          priceDiference = currentDifference;
          reverseAsset = [ticker, priceArray];
        }
      });
      if (reverseAsset) {
        const reverseExit = jsonSearch(jsonInput2, 'exact', reverseAsset[0])[0];
        return [reverseAsset[0], reverseAsset[1][1], reverseExit ? reverseExit[1][2] : '0.01'];
      } else {
        return [];
      }
    };

    setList({});

    const searchResult =
      search_string[search_string.length - 2] === 'W'
        ? jsonSearch(jsonInput1, 'seriesSearch', search_string, false)
        : jsonSearch(jsonInput1, 'includes');
    searchResult.forEach(([current_asset, prices]) => {
      setList(previous => ({
        ...previous,
        [current_asset]: [
          prices[0],
          prices[1],
          getExitInfo(current_asset),
          ...getReverseOperation(prices[1], current_asset)
        ]
      }));
    });
  };

  return (
    <>
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <PeriodSelector
            text1={'01 / 07 - 05 / 07 (GS W1)'}
            text2={''}
            click={() => setDateIndex(1)}
          />
          <PeriodSelector
            text1={'24 / 06 - 28 / 06 (FR W4)'}
            text2={'ABEV3 / VALE3 / GGBR4 / BOVA11'}
            click={() => setDateIndex(2)}
          />
          <PeriodSelector
            text1={'17 / 06 - 21 / 06 (FR W3 unavailable)'}
            text2={''}
            click={() => setDateIndex(3)}
          />
          <PeriodSelector
            text1={'10 / 06 - 14 / 06 (FR W2)'}
            text2={''}
            click={() => setDateIndex(4)}
          />
          <PeriodSelector
            text1={'03 / 06 - 07 / 06 (FR W1)'}
            text2={''}
            click={() => setDateIndex(5)}
          />
          <SelectComponent value={0} data={[]} onChange={e => e} />
        </div>

        <input type="text" onChange={e => search(e.target.value, true)} />
        <OperationsList listPayload={list} />
      </div>
    </>
  );
};

export default OperationPage;
