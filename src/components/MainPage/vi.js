import { Virtuoso } from "react-virtuoso";
import { generateUsers } from "./data";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";

export default function App() {
  const START_INDEX = 110;
  const INITIAL_ITEM_COUNT = 10;

  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);
  const [users, setUsers] = useState(() =>
    generateUsers(INITIAL_ITEM_COUNT, START_INDEX)
  );
  console.log("users:", users);
  const prependItems = useCallback(() => {
    const usersToPrepend = 2;
    const nextFirstItemIndex = firstItemIndex - usersToPrepend;

    setTimeout(() => {
      setFirstItemIndex(() => nextFirstItemIndex);
      setUsers(() => [
        ...generateUsers(usersToPrepend, nextFirstItemIndex),
        ...users,
      ]);
    }, 500);

    return false;
  }, [firstItemIndex, users, setUsers]);

  useEffect(() => {
    console.log("users updated:", users);
  }, [users]);

  return (
    <Virtuoso
      style={{ height: 400 }}
      firstItemIndex={firstItemIndex}
      initialTopMostItemIndex={INITIAL_ITEM_COUNT - 1}
      data={users}
      startReached={prependItems}
      itemContent={(index, user) => {
        return (
          <div
            style={{ backgroundColor: user.bgColor, padding: "1rem 0.5rem" }}
          >
            <h4>
              {user.index}. {user.name}
            </h4>
            <div style={{ marginTop: "1rem" }}>{user.description}</div>
          </div>
        );
      }}
    />
  );
}
