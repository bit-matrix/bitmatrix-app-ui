import SWAP_MAIN_TAB from "../../enum/SWAP_MAIN_TAB";

interface ISwapMainTab {
  selectedMainTab: SWAP_MAIN_TAB;
  setSelectedMainTab: (swapMainTab: SWAP_MAIN_TAB) => void;
}

const SwapMainTab: React.FC<ISwapMainTab> = ({ selectedMainTab, setSelectedMainTab }) => {
  return (
    <div className="swap-page-tabs">
      <div
        onClick={() => {
          setSelectedMainTab(SWAP_MAIN_TAB.SWAP);
        }}
        className={`swap-page-tab-left ${selectedMainTab === SWAP_MAIN_TAB.SWAP ? "selected" : ""}`}
      >
        <span>Swap</span>
      </div>
      <div className="swap-page-tab-middle"></div>
      <div
        onClick={() => {
          setSelectedMainTab(SWAP_MAIN_TAB.POOL);
        }}
        className={`swap-page-tab-right ${selectedMainTab === SWAP_MAIN_TAB.POOL ? "selected" : ""}`}
      >
        <span>Pool</span>
      </div>
    </div>
  );
};

export default SwapMainTab;
