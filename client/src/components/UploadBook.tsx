import * as React from 'react'
import { Button, Form } from 'semantic-ui-react'
import { getUploadUrl, uploadFile } from '../api/books-api'
import Auth from '../auth/Auth'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface EditBookProps {
  match: {
    params: {
      bookId: string
    }
  }
  auth: Auth
}

interface EditBookState {
  file: any
  uploadState: UploadState
}

export class UploadBook extends React.Component<EditBookProps, EditBookState> {
  state: EditBookState = {
    file: undefined,
    uploadState: UploadState.NoUpload
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files
    if (!file) return

    this.setState({ file: file[0] })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(
        this.props.auth.getIdToken(),
        this.props.match.params.bookId
      )
      console.log('UploadUrl >>>> ' + uploadUrl)
      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({ uploadState })
  }

  render() {
    return (
      <div>
        <h1>Upload new book</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept=".pdf"
              placeholder="Book to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && (
          <p>Uploading book metadata</p>
        )}
        {this.state.uploadState === UploadState.UploadingFile && (
          <p> Uploading file</p>
        )}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
