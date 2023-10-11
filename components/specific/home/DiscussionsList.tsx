"use client";

import { useEffect, useState } from "react";
import {
  BsBoxArrowUpRight,
  BsExclamationCircle,
  BsInfoCircle,
} from "react-icons/bs";

import { type Discussion } from "@prisma/client";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import RedirectButton from "@/components/ui/RedirectButton";
import TagInput from "@/components/ui/TagInput";
import toast from "react-hot-toast";
import { Checkbox } from "@nextui-org/react";
import Button from "@/components/ui/Button";

export default function DiscussionsList({ URL }: { URL: string }) {
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInputValue, setTagInputValue] = useState("");
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState<Discussion[]>([]);

  const [onlyOpen, setOnlyOpen] = useState(true);
  const [onlyClosed, setOnlyClosed] = useState(true);
  const [strictTagChecking, setStrictTagChecking] = useState(true);

  useEffect(() => {
    fetch(URL + "/api/discussion/get", {
      method: "POST",
      body: JSON.stringify({ id: "not_needed", getAll: true }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg.endsWith("[200]")) {
          setDiscussions(data.discussions);
          setFilteredDiscussions(data.discussions);
          setIsFetching(false);
        } else {
          setIsError(true);
        }
      });
  }, [URL]);

  function filterDiscussions() {
    const myFilteredDiscussions = discussions.filter((discussion) => {
      if (strictTagChecking) {
        const isOpen = !discussion.closed;
        const matchesInput = discussion.title
          .toLowerCase()
          .includes(inputValue.toLowerCase());

        const hasTagsToMatch = tags.length === 0 || !strictTagChecking;

        const hasAllTags = hasTagsToMatch
          ? true
          : tags.every((tag) => discussion.tags.includes(tag));

        if (!onlyOpen && !onlyClosed) {
          return false;
        }

        if (onlyOpen !== onlyClosed) {
          if ((onlyOpen && isOpen) || (onlyClosed && !isOpen)) {
            return matchesInput && hasAllTags;
          }
        } else {
          return hasAllTags && matchesInput;
        }

        return false;
      } else {
        const isOpen = !discussion.closed;
        const matchesInput = discussion.title
          .toLowerCase()
          .includes(inputValue.toLowerCase());

        if (!onlyOpen && !onlyClosed) {
          return false;
        }

        if (onlyOpen !== onlyClosed) {
          if ((onlyOpen && isOpen) || (onlyClosed && !isOpen)) {
            if (tags.length === 0) {
              return matchesInput;
            } else {
              return (
                matchesInput &&
                discussion.tags.some((tag) => tags.includes(tag))
              );
            }
          }
        } else {
          if (tags.length === 0) {
            return matchesInput;
          } else {
            return (
              matchesInput && discussion.tags.some((tag) => tags.includes(tag))
            );
          }
        }

        return false;
      }
    });
    setFilteredDiscussions(myFilteredDiscussions);
  }

  if (isError) {
    return (
      <div className="w-full px-4 flex flex-col gap-8 items-start justify-start text-red-400">
        <BsExclamationCircle />
        Error loading discussions. Try reloading the page.
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="w-screen px-4 flex flex-col gap-8 items-start justify-start">
        <Input
          isDisabled={true}
          className="w-[35rem] max-w-[100%]"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          size="lg"
          radius="sm"
          variant="underlined"
          placeholder="loading discussions..."
        />
      </div>
    );
  }

  function handleTagInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (tags.length >= 5) return toast.error("You can only add 5 tags");
      if (e.currentTarget.value.length > 15)
        return toast.error("Tag cannot exceed 15 characters");
      if (tags.includes(e.currentTarget.value))
        return toast.error("Tag already exists");
      if (tagInputValue.length < 2)
        return toast.error("Tag must be at least 2 characters long");

      setTags([...tags, e.currentTarget.value]);
      setTagInputValue("");
    }
    if (e.key === ",") {
      if (tags.length >= 5) return toast.error("You can only add 5 tags");
      if (e.currentTarget.value.length > 15)
        return toast.error("Tag cannot exceed 15 characters");
      if (tags.includes(e.currentTarget.value))
        return toast.error("Tag already exists");
      if (tagInputValue.length < 2)
        return toast.error("Tag must be at least 2 characters long");

      setTags([...tags, e.currentTarget.value]);
      setTagInputValue("");
      e.preventDefault();
    }

    if (e.key === "Backspace" && e.currentTarget.value === "") {
      setTags(tags.slice(0, tags.length - 1));
    }
  }

  function handleTagInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTagInputValue(e.target.value);
    e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z0-9]/g, "");
  }

  function handleTagDelete(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const tag = e.currentTarget.previousSibling?.textContent;
    if (tag !== undefined) {
      setTags(tags.filter((t) => t !== tag));
    }
  }

  return (
    <div className="w-screen px-4 flex flex-col gap-8 items-start justify-start">
      <Input
        className="w-[45rem] max-w-[92vw]"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        size="lg"
        radius="sm"
        variant="underlined"
        placeholder="search discussions by name..."
      />
      <TagInput
        inputValue={tagInputValue}
        onInputChange={handleTagInputChange}
        onInputKeyDown={handleTagInputKeyDown}
        onTagDelete={handleTagDelete}
        tags={tags}
      />
      <div className="flex flex-col w-screen items-start justify-start gap-2">
        <div className="flex flex-wrap gap-3 items-center justify-start">
          Strict Tag Checking:
          <Checkbox
            isSelected={strictTagChecking}
            onChange={(e) => {
              setStrictTagChecking(e.target.checked);
            }}
            color="primary"
            className="cursor-pointer"
          />
        </div>
        <span className="text-gray-500 text-sm inline max-w-[calc(92vw-2rem)]">
          If strict tag checking is enabled, then the tags you entered will be
          checked with all of the tags of the discussions, and if it is
          disabled, then only one of the tags of the discussions will be matched
          with your tags.
        </span>
      </div>
      <div className="flex flex-wrap gap-2 items-center justify-start mt-5">
        <Chip
          color={onlyOpen ? "primary" : "default"}
          size="lg"
          className="cursor-pointer transition-background"
          onClick={() => setOnlyOpen((prev) => !prev)}
        >
          Open
        </Chip>
        <Chip
          color={onlyClosed ? "primary" : "default"}
          size="lg"
          className="cursor-pointer transition-background"
          onClick={() => setOnlyClosed((prev) => !prev)}
        >
          Closed
        </Chip>
      </div>

      <Button className="w-[92%]" color="primary" onPress={filterDiscussions}>Search</Button>

      <div className="flex flex-wrap items-center justify-start gap-4 w-full mt-5">
        {filteredDiscussions.map((discussion: Discussion, k: number) => (
          <div
            key={k}
            className={`w-[30rem] max-w-[calc(100vw-2rem)] py-4 px-3 dark:bg-white/10 bg-zinc-300 flex flex-col items-start justify-start gap-4 rounded-xl min-h-[18rem] h-fit overflow-scroll`}
          >
            <h3 className="font-semibold text-[1.9rem]">{discussion.title}</h3>
            {discussion.closed ? (
              <Chip color="warning">Closed</Chip>
            ) : (
              <Chip color="success">Open</Chip>
            )}
            <div className="flex flex-wrap gap-2 items-center justify-start mt-4">
              Tags:{" "}
              {discussion.tags.map((tag: string, k: number) => (
                <Chip key={k} color="primary">
                  # {tag}
                </Chip>
              ))}
              {discussion.tags.length === 0 && <span className="text-gray-400">No tags</span>}
            </div>
            <RedirectButton
              href={`/discussion/${discussion.id}`}
              isIconOnly={true}
              color="primary"
              className="mt-auto ml-auto"
            >
              <BsBoxArrowUpRight />
            </RedirectButton>
          </div>
        ))}
      </div>
    </div>
  );
}
