import React, { useState, useEffect } from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';

 
function File({filename,repo,folder}) {
  const [content, setContent] = useState('');
  const language = filename.split('.')[1];
  const dev = process.env.NODE_ENV == 'development';
  
  const editUrl = `https://github.com/${repo}/blob/master/docs/`;
  const rawDocs =`https://raw.githubusercontent.com/${repo}/master/docs/`;  
  function readFromX(path) {
    if (dev) {
      fetch(path)
        .catch((e) => {
          return { error: e };
        })
        .then((content) => {
          content.text().then((c) => {
            console.log(c.split('\n'));
            setContent(c);
          });
        });
      } else {
        fetch(rawDocs+folder+"/"+filename)
          .catch((e) => {
            return { error: e };
          })
          .then((content) => {
            content.text().then((c) => {
              console.log(c.split('\n'));
              console.log(c);
              setContent(c);
            });
          });

    }
  }

  useEffect(() => {
    readFromX(filename);
  }, [filename]);
  //return "Read nothing";

  return (
    <div>
      <p>{process.env.NODE_ENV}</p>
      <pre className='title'>
        <a href={editUrl + folder + '/' + filename}>{filename}</a>
      </pre>
      <a href={editUrl + folder + '/' + filename} className='ne'>
        <Highlight {...defaultProps} code={content} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </a>
    </div>
  );
}

export default File;