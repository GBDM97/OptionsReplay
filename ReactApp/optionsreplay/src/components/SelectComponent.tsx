import styled from 'styled-components';

const SelectWrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const SelectBox = styled.select`
  width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  appearance: none;
  background-color: white;
  font-size: 16px;
  color: #333;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }
`;

const SelectArrow = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  width: 0;
  height: 0;
  pointer-events: none;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #333;
  transform: translateY(-50%);
`;

const SelectComponent: React.FC<{
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  data: Array<string | number>;
  value: string | number;
}> = ({ onChange, data, value }) => (
  <SelectWrapper>
    <SelectBox onChange={onChange} value={value}>
      {data.map((e, i) => (
        <option value={i}>{e}</option>
      ))}
    </SelectBox>
    <SelectArrow />
  </SelectWrapper>
);

export default SelectComponent;
