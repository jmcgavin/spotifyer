import styled from '@emotion/styled'

export const Spinner = styled.div`
  height: 0;
  width: 0;
  padding: 16px;
  border: 3px solid var(--mui-palette-secondary-main);
  border-right-color: transparent;
  border-radius: 22px;
  animation: rotate 1s infinite linear;

  @keyframes rotate {
    /* 100% keyframe for clockwise. 0% for anticlockwise */
    100% {
      transform: rotate(360deg);
    }
  }
`
