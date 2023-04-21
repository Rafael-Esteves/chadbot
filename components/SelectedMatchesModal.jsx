import { useEffect, useState } from "react";
import Modal from "./Modal";
import { HomeContext } from "@/context/HomeContext";
import { useContext } from "react";
import Match from "./Match";
import Button from "./Button";
import TextInput from "./TextInput";

export default function SelectedMatchesModal() {
  const {
    setSelectedMatches,
    matches,
    selectedMatches,
    showSelectedMatches,
    setShowSelectedMatches,
  } = useContext(HomeContext);

  const [filteredMatches, setFilteredMatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    matches &&
      setFilteredMatches(
        matches.filter((m) =>
          m.person.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
  }, [matches, searchQuery]);

  return (
    <Modal
      title="Selected Matches"
      visible={showSelectedMatches}
      setVisible={setShowSelectedMatches}
    >
      <div className="min-w-[200px]">
        <div className="px-4 mt-4 whitespace-pre-wrap text-white">
          <p>
            Selected matches are highlighted in green and will be on the loop.
            Deselected matches will be skipped.
          </p>
        </div>
        <div className="px-4 mt-8 flex flex-row">
          <TextInput
            autoFocus
            labelText="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </div>
        <div className="p-4 flex flex-row">
          <Button
            text="Select all"
            action={() => {
              setSelectedMatches(matches);
            }}
          />
          <Button
            text="deselect all"
            color="slate"
            action={() => {
              setSelectedMatches([]);
            }}
          />
        </div>
        <div className="overflow-auto no-scrollbar h-96 text-white ">
          {filteredMatches &&
            filteredMatches.map((match) => {
              const selected = selectedMatches?.includes(match);
              return (
                <Match
                  match={match}
                  key={match._id}
                  selected={selected}
                  setShowSelectedMatches={setShowSelectedMatches}
                ></Match>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}
