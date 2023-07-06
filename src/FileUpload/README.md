# [WIP] FileUpload

The FileUpload component allows for media (e.g. images and documents) to be imported.

## FileUpload slots

Because each use case of the FileUpload component will be uploading content to a different end point; the consumer, or the developer using the component, must manage the component's state. This means that only the consumer, not the design system, will know if a file has successfully uploaded, errored, or is still in progress. Since this component relies on consumer management, FileUpload was designed using Slots.

A Slot, is a child component added by the consumer but positioned by the FileUpload component.

The following components are FileUpload slots:

- `FileUpload.Label` - The label of the input field.
- `FileUpload.Description` - A description, or helpful text, detailing guidance on how to upload a file. For example, the description might include details on size limits, or allowed file types.
- `FileUpload.Item` - A preview of a file that has been uploaded.
- `FileUpload.Status` - A success or warning message indicating that status of a file upload.

Below is an example of how a consumer will add each slot to their component:

```tsx
<FileUpload ref={inputRef} onChange={handleFileUpload}>
  <FileUpload.Label>Upload your files</FileUpload.Label>
  <FileUpload.Description>Max. size: 25MB</FileUpload.Description>
  {uploadedFile && <FileUpload.Status status="success">1 file successfully added!</FileUpload.Status>}
  {uploadedFile && (
    <FileUpload.Item
      key={uploadedFile.name}
      file={uploadedFile}
      status={'success'}
      progress={100}
      onClick={() => {
        setUploadedFile(undefined)
        inputRef.current?.focus()
      }}
    />
  )}
</FileUpload>
```

## Component Accessibility considerations

### Hidden semantic input

The FileUpload component is composed of a visuallyHidden `<input>` field and a Primer `<Button>`.

- The semantic `<input>` allows us to utilize the operating systems default file upload. While also creating a familiar screen reader user experience.
- The Primer `<Button>` allows us to style the FileUpload in a way that feels cohesive to our branding.

#### How do the button and input interact?

When a user tab's to the FileUpload component the DOM focuses on the `<input>` field but adds focus styling to the visual `<Button>`. Visually it appears that the button is focused, when in reality the input is. The user cannot tab to the `<Button>` but the user can click on it.

When a user click's on the `<Button>` the onClick of the `<input>` field is triggered.

### Progress Bar

The ProgressBar component is used in the `FileUpload.Item` to help give users feedback by indicating the progress of an upload. The ProgressBar has the following attributes to help dictate the same information to screen reader users.

- `tabIndex={-1}`
- `aria-valuenow` or `aria-valuetext`
- `aria-valuemin`
- `aria-valuemax`
- `aria-busy`

It is important to take note of the `tabIndex={-1}`. This tabIndex allows consumers to move focus to the progress bar and focusing on the progress bar is the main way screen readers will be able to interpret progress bars status. (See [focus management](#focus-management) for more details)

### Aria-labelledby and aria-describedby

This component uses `React.createContext` to pass IDs around slotted components. The IDs are used to set aria-labelledby and aria-describedby values on the `<input>` field.

### Announcements (WIP/not yet implemented)

A `FileUpload.Status` should be added when a file has successfully uploaded or when an error has occurred.

Each `FileUpload.Status` should be announced using aria-live announcement this will inform screen reader users of the status of the upload.

## Consumer Accessibility considerations

### Focus management

#### Scenarios

- When a user uploads a file, focus should move to the `progressBar` component.
- When a user presses the remove button on a file preview, focus should move to either:
  1. The next file preview.
  2. The previous file preview, if there isn't a 'next'.
  3. The file input, if there are no file previews.
- When a user presses the retry button on a file preview, the focus should move back to the the `progressBar` component.

### Naming Conventions

You can customize FileUpload's button text by using the `buttonProps` prop:

```tsx
<FileUpload buttonProps={{children: 'Upload files'}}>...</FileUpload>
```

If you choose to customize FileUpload's button text ensure you use plural form (e.g. Upload file`s`) if and only if the `multiple` prop has been set.

### TODOS

Due to time constraints we focused our attention on getting this component working for a single file upload. Though `multiple` is supported as a prop, we still need to work out how to handle announcements and focus management of the success and error status messages (`FileUpload.status`).

Other clean up work includes:

- [ ] - Adding test cases
- [ ] - Adding documentation
- [ ] - Adding `aria-live` in the `FileUpload.status` slot
- [ ] - Determine if focus management can be managed internally
