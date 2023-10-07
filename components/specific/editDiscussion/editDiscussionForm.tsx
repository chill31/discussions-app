"use client";

import "@uploadthing/react/styles.css";

import Container from "@/components/page/Container";
import Button from "@/components/ui/Button";
import TagInput from "@/components/ui/TagInput";
import Title from "@/components/ui/Title";
import { UploadButton } from "@/helpers/uploadthing";
import { Input, Textarea } from "@nextui-org/input";
import {
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import ReactMarkdown from "react-markdown";

import { Checkbox } from "@nextui-org/checkbox";
import { Tooltip } from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";

export default function EditDiscussionForm({ id, URL, defaultData }: { id: string; URL: string; defaultData: { title: string; content: string; tags: string[]; unlisted: boolean; } }) {
  const router = useRouter();
  const { user } = useUser();

  const [title, setTitle] = useState(defaultData.title);
  const [content, setContent] = useState(defaultData.content);
  const [tagInputValue, setTagInputValue] = useState("");
  const [tags, setTags] = useState<string[]>(defaultData.tags);
  const [isUnlisted, setIsUnlisted] = useState(defaultData.unlisted);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [fileName, setFileName] = useState("");
  const [fileLink, setFileLink] = useState("");

  const [isEditing, setIsEditing] = useState(false);

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

  function editDiscussion() {
    setIsEditing(true);
    const data = {
      content,
      title,
      tags,
      unlisted: isUnlisted,
      id: id,
    };
    fetch(URL + "/api/discussion/edit", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((recieved) => {
        if (recieved.msg.endsWith("[200]")) {
          toast.success("Discussion edited");
          router.refresh();
          router.push("/dashboard");
        } else {
          toast.error("Error in editing discussion");
        }
        setIsEditing(false);
      });
  }

    return (
      <Container>
        <Title>Edit Discussion</Title>

        <div className="w-full flex flex-col items-center justify-center gap-14 mt-8">
          <Input
            label="enter discussion topic"
            max={35}
            variant="underlined"
            className="w-[45rem] max-w-[92%]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="w-[45rem] max-w-[92%] flex flex-col items-center justify-between gap-4">
            <UploadButton
              endpoint="imageUploader"
              className="self-start mt-4"
              onClientUploadComplete={(res: any) => {
                console.log("Files: ", res);
                toast.success("Upload Completed");
                onOpen();
                setFileName(res !== undefined ? res[0].name : "");
                setFileLink(res !== undefined ? res[0].url : "");
              }}
              onUploadError={(error: Error) => {
                toast.error(
                  `ERROR! ${error.message}\nTry again sometime later.`
                );
              }}
            />
            <Textarea
              variant="underlined"
              minRows={1}
              maxRows={35}
              placeholder="enter discussion content. markdown is supported. You can even add images through the above button"
              className="w-[45rem] max-w-[100%]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <TagInput
            inputValue={tagInputValue}
            tags={tags}
            onInputKeyDown={handleTagInputKeyDown}
            onInputChange={handleTagInputChange}
            onTagDelete={handleTagDelete}
          />
          <span className="w-[45rem] max-w-[92%] flex items-center justify-start gap-4">
            <Tooltip content="whether the discussion will be accessible by link only or on home page">
              <span>Unlisted?</span>
            </Tooltip>
            <Checkbox
              isSelected={isUnlisted}
              onChange={(e: any) => setIsUnlisted(e.target.checked)}
            />
          </span>
          <div className="w-[45rem] max-w-[92%] flex flex-col items-end justify-center">
            <Button
              color="primary"
              className="self-end"
              onClick={() => {
                if (title.length < 5)
                  return toast.error(
                    "Title must be at least 5 characters long"
                  );
                if (content.length < 10)
                  return toast.error(
                    "Content must be at least 10 characters long"
                  );
                editDiscussion();
              }}
              isLoading={isEditing}
            >
              Confirm
            </Button>
          </div>
        </div>

        <Modal
          scrollBehavior="inside"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          className="p-5"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="!text-h2">Uploaded</ModalHeader>
                <ModalBody>
                  <ReactMarkdown>{`Add this in your content text box:
                
                
\`\`\`![${fileName}](${fileLink})\`\`\``}</ReactMarkdown>
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `![${fileName}](${fileLink})`
                      )
                    }
                  >
                    Copy
                  </Button>
                  <Button color="success" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </Container>
    );
}
