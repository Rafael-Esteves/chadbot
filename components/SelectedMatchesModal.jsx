import { useEffect, useState } from "react";
import Modal from "./Modal";
import { HomeContext } from "@/context/HomeContext";
import { useContext } from "react";
import Match from "./Match";
import Button from "./Button";
import TextInput from "./TextInput";
import useTranslation from "next-translate/useTranslation";

export default function SelectedMatchesModal() {
  const {
    setSelectedMatches,
    matches,
    selectedMatches,
    showSelectedMatches,
    setShowSelectedMatches,
    autoChatting,
    setAutoChatting,
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

  const { t } = useTranslation("main");

  return (
    <Modal
      title="Selected Matches"
      visible={showSelectedMatches}
      setVisible={setShowSelectedMatches}
      positiveText={"Ok"}
      positive={() => {
        setAutoChatting(true);
      }}
    >
      <div className="min-w-[200px]">
        <div className="px-4 mt-4 whitespace-pre-wrap text-white">
          <p>{t("selected_matches_description")}</p>
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
            text={t("select_all")}
            action={() => {
              setSelectedMatches(matches);
            }}
          />
          <Button
            text={t("deselect_all")}
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
