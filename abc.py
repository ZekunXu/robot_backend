
import sys 
import requests
from PIL import Image
from io import BytesIO
import matplotlib.pyplot as plt

def main():

    img_url = 'http://www.chenkeai.com:3001/assets/appImgs/IMG_1783.jpg'
    try:
        encoded_img = requests.get(img_url).content
        ori_img = Image.open(BytesIO(encoded_img))
        # Cropped image of above dimension
        # (It will not change orginal image)
        crop_img = ori_img.crop((351, 335, 917, 903))
    
        # Shows the image in image viewer
        plt.imshow(crop_img)
        crop_img.save('0.png')
        print('hello 2 2')
        return 0
    except Exception as e:
        print(f'download image {img_url} error: {e}')

#start process
if __name__ == '__main__':
    print('hello')
    main()