import { Virtuoso } from "react-virtuoso";
import { generateUsers } from "./data";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";

const generated = [];
export function user(index = 0) {
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();

  return {
    index: index + 1,
    bgColor: toggleBg(index),
    name: `${firstName} ${lastName}`,
    initials: `${firstName.substr(0, 1)}${lastName.substr(0, 1)}`,
    jobTitle: faker.name.jobTitle(),
    description: faker.lorem.sentence(10),
    longText: faker.lorem.paragraphs(1),
  };
}
export const getUser = (index, i) => {
  if (!generated[index]) {
    generated[index] = user(index);
  }

  return generated[index];
};

//2010,

function generateUsers(length, startIndex = 0) {
  return Array.from({ length }).map((_, i) => getUser(i + startIndex, i));
  /*
  The first parameter (represented by _) is a placeholder for the current element in the array.
   Since we're not interested in the values of the array elements (they are all undefined),
    we use _ as a conventional way to indicate that we're not using this parameter.

i: The second parameter (represented by i) is the index of the current element in the array. 
It represents the position of the element in the array.

as fisrt element is at 10000 and usersToPrepend =2
which means 9998 will be our new first ele and it will be till 9999 as added (0-1)
  
  */
}

export default function App() {
  const START_INDEX = 10000; // index number assigned to "first user"
  const INITIAL_ITEM_COUNT = 10; //size of array --->total 10 users 0-9 only | 10009 will be "last user"

  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);
  const [users, setUsers] = useState(() =>
    generateUsers(INITIAL_ITEM_COUNT, START_INDEX)
  );

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
