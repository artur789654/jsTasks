document.addEventListener("DOMContentLoaded", () => {
  const newCommentText = document.getElementById("new-comment-text");
  const addCommentBtn = document.getElementById("add-comment-btn");
  const commentsList = document.getElementById("comments-list");

  const loadComments = () => {
    const storageComments = localStorage.getItem("comments");
    return storageComments ? JSON.parse(storageComments) : [];
  };

  const saveComment = (comments) => {
    localStorage.setItem("comments", JSON.stringify(comments));
  };

  const renderComments = (comments) => {
    commentsList.innerHTML = "";

    const commentElements = {};

    comments.forEach((comment) => {
      const commentElement = createCommentElement(comment);
      if (!comment.replyId) {
        commentsList.appendChild(commentElement);
      } else {
        const parrentElement = commentElements[comment.replyId];
        if (parrentElement) {
          let nestedList = parrentElement.querySelector(".nested-list");
          if (!nestedList) {
            nestedList = document.createElement("div");
            nestedList.classList.add("nested-list");
            parrentElement.appendChild(nestedList);
          }
          nestedList.appendChild(commentElement);
        }
      }
      commentElements[comment.id] = commentElement;
    });
  };

  const createCommentElement = (comment) => {
    const commentElement = document.createElement("li");
    commentElement.classList.add("comment");
    commentElement.dataset.id = comment.id;

    commentElement.innerHTML = `
    <div class ="comment-header">
      <span class ="comment-time">${comment.time}</span>
      <button class="delete-btn">Delete</button>
    </div>
    <div class="comment-body">
      <p>${comment.text}</p>
    </div>
    <button class = "reply-btn">Reply</button>
    <ul class="nested-list"></ul>`;

    const deleteBtn = commentElement.querySelector(".delete-btn");
    const replyBtn = commentElement.querySelector(".reply-btn");

    deleteBtn.addEventListener("click", () => deleteComment(comment.id));
    replyBtn.addEventListener("click", () => {
      if (!commentElement.querySelector(".reply-form")) {
        const replyForm = createReplyForm(comment.id);
        commentElement.appendChild(replyForm);
      }
    });

    return commentElement;
  };

  const addComment = (commentText) => {
    const comments = loadComments();

    const newComment = {
      id: new Date().getTime(),
      text: commentText,
      time: new Date().toLocaleString(),
      replyId: null,
    };
    comments.push(newComment);
    saveComment(comments);
    renderComments(comments);
  };

  const createReplyForm = (parentId) => {
    const replyForm = document.createElement("div");
    replyForm.classList.add("reply-form");

    replyForm.innerHTML = `<textarea placeholder="Your reply"></textarea>
    <button class="send-reply">Reply</button>
    <button class="cancel-reply">Cancel</button>`;

    const replyTextArea = replyForm.querySelector("textarea");
    const replyBtn = replyForm.querySelector(".send-reply");
    const cancelBtn = replyForm.querySelector(".cancel-reply");

    replyTextArea.addEventListener("blur", () => {
      const replyText = replyTextArea.value.trim();
      if (!replyText) {
        replyForm.remove();
      }
    });
    replyBtn.addEventListener("click", () => {
      const replyText = replyTextArea.value.trim();
      if (replyText) {
        addReply(parentId, replyText);
        replyForm.remove();
      }
    });

    cancelBtn.addEventListener("click", () => {
      replyForm.remove();
    });
    return replyForm;
  };

  const addReply = (parentId, replyText) => {
    const comments = loadComments();

    const newReply = {
      id: new Date().getTime(),
      text: replyText,
      time: new Date().toLocaleString(),
      replyId: parentId,
    };

    comments.push(newReply);
    saveComment(comments);
    renderComments(comments);
  };

  const deleteComment = (commentId) => {
    const comments = loadComments();

    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId && comment.replyId !== commentId
    );

    saveComment(updatedComments);
    renderComments(updatedComments);
  };

  addCommentBtn.addEventListener("click", () => {
    const commentText = newCommentText.value.trim();
    if (commentText) {
      addComment(commentText);
      newCommentText.value = "";
    }
  });

  const comments = loadComments();
  renderComments(comments);
});
