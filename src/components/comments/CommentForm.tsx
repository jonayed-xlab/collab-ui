import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { commentSchema } from '../../utils/formSchemas';
import commentService from '../../services/commentService';

interface CommentFormProps {
  entityType: string;
  entityId: number;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ entityType, entityId, onCommentAdded }) => {
  const handleSubmit = async (values: { content: string }, { setSubmitting, resetForm }: any) => {
    try {
      const response = await commentService.createComment({
        content: values.content,
        entityType,
        entityId,
      });

      if (response.success) {
        resetForm();
        onCommentAdded();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ content: '' }}
      validationSchema={commentSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-3">
          <div>
            <Field
              as="textarea"
              name="content"
              id="content"
              className="input h-24"
              placeholder="Add a comment..."
            />
            <ErrorMessage name="content" component="div" className="form-error" />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Add Comment'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CommentForm;