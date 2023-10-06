import { Input } from "@nextui-org/input";
import { BsXLg } from "react-icons/bs";

export default function TagInput({
  tags,
  inputValue,
  onInputChange,
  onInputKeyDown,
  onTagDelete
}: {
  tags: string[];
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onTagDelete: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-start gap-4 flex-wrap">
      <div className="flex items-center justify-start gap-2 w-full flex-wrap max-w-[90vw]">
        {tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="bg-blue-500 rounded-full py-1 px-4 text-white flex items-center justify-center gap-2"
          >
            {tag}
            <BsXLg className='text-base cursor-pointer' onClick={onTagDelete} />
          </span>
        ))}
      </div>
      <Input
        variant="underlined"
        type="text"
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={onInputKeyDown}
        placeholder="enter a few tags. Press enter or put a comma to create a tag"
        className="w-[45rem] max-w-[92vw]"
      />
    </div>
  );
}
