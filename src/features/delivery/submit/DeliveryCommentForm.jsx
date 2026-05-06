import { useState } from "react";

export default function DeliveryCommentForm({
  onSubmit,
}) {
  const [comment, setComment] = useState("");

  return (
    <div className="space-y-4">
      <textarea
        className="input min-h-32"
        placeholder="Enter comments"
        value={comment}
        onChange={(e) =>
          setComment(e.target.value)
        }
      />

      <button
        className="btn-primary w-full"
        onClick={() =>
          onSubmit(comment)
        }
      >
        Submit Delivery
      </button>
    </div>
  );
}