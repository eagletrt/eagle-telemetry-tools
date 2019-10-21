#!/bin/bash

if [ $1 = "vcan0" ]
    then
        echo "setting up vcan ..."
        sudo modprobe vcan
        sudo ip link add dev vcan0 type vcan
        sudo ifconfig vcan0 up
        echo "setup done :)"
    else
        echo "setting up can0 ..."
        sudo modprobe i2c-dev
        sudo modprobe can_dev
        sudo modprobe can_raw
        sudo modprobe can
        sudo ip link set can0 up type can bitrate 1000000
        sudo ifconfig can0 up
        echo "setup done :)"
fi
