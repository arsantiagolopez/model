import { FC, useCallback, useMemo } from "react";
import { Column, useBlockLayout, useSortBy, useTable } from "react-table";
import { FixedSizeList } from "react-window";
import atp_players from "../../data/atp_players.json";
import atp_rankings from "../../data/atp_rankings_current.json";
import wta_players from "../../data/wta_players.json";
import wta_rankings from "../../data/wta_rankings_current.json";
import { PlayerInfo, RankingInfo } from "../../types";

interface Props {
  tour: string;
}

interface Rankings {
  [player: string]: RankingInfo;
}

interface Players {
  [player: string]: PlayerInfo;
}

const RankingTable: FC<Props> = ({ tour }) => {
  const rankings = (tour === "atp"
    ? atp_rankings
    : wta_rankings) as unknown as Rankings;
  const players = (tour === "atp" ? atp_players : wta_players) as Players;

  // Header columns for both ATP & WTA Rankings
  const columns: Array<Column> = useMemo(
    () => [
      {
        Header: "Rank",
        accessor: "rank",
        width: 50,
      },
      {
        Header: "Player",
        accessor: "player",
        id: "player",
        width: 200,
      },
      {
        Header: "Points",
        accessor: "points",
        width: 50,
      },
    ],
    []
  );

  // ATP Rankings
  const data = useMemo(
    () =>
      Object.keys(rankings).map((id) => {
        let { rank, player: playerId, points } = rankings[id];

        const player = players[playerId];
        const name = `${player.name_last} ${player.name_first.charAt(0)}.`;

        return { rank, player: name, points };
      }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: "rank",
            desc: false,
          },
        ],
      },
    },
    useSortBy,
    useBlockLayout
  );

  const RenderRow = useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          className="text-fourth hover:bg-primary rounded-sm"
          {...row.getRowProps({
            style,
          })}
        >
          {row.cells.map((cell) => {
            return <div {...cell.getCellProps()}>{cell.render("Cell")}</div>;
          })}
        </div>
      );
    },
    [prepareRow, rows]
  ) as (args: any) => any;

  return (
    <div className="mt-2" {...getTableProps()}>
      <div className="font-bold pb-2">
        {
          // Loop over the header rows
          headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()}>
              {
                // Loop over the headers in each row
                headerGroup.headers.map((column) => (
                  // Apply the header cell props
                  <div
                    className="text-left pr-2"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
      <div {...getTableBodyProps()}>
        <FixedSizeList
          height={500}
          itemCount={rows.length}
          itemSize={17}
          width={totalColumnsWidth}
        >
          {RenderRow}
        </FixedSizeList>
      </div>
    </div>
  );
};

export { RankingTable };
